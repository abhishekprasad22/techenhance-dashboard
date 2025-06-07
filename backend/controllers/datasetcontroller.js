let datasets = [
  {
    id: "1",
    name: "Sales Data",
    data: [
      { month: "Jan", sales: 1200, revenue: 15000 },
      { month: "Feb", sales: 1900, revenue: 23000 },
      { month: "Mar", sales: 3000, revenue: 35000 },
      { month: "Apr", sales: 5000, revenue: 58000 },
      { month: "May", sales: 4200, revenue: 48000 },
      { month: "Jun", sales: 3800, revenue: 42000 },
    ],
    type: "time_series",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Product Categories",
    data: [
      { category: "Electronics", value: 35 },
      { category: "Clothing", value: 25 },
      { category: "Books", value: 15 },
      { category: "Home & Garden", value: 15 },
      { category: "Sports", value: 10 },
    ],
    type: "categorical",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Age Distribution",
    data: Array.from({ length: 50 }, (_, i) => ({
      age: 18 + i,
      count: Math.floor(Math.random() * 100) + 10,
    })),
    type: "distribution",
    createdAt: new Date().toISOString(),
  },
];

// Returns a json obj with params {id, name, type, createdAt, dataPoints}
// Returns all the present data sets
const getDataSet = async (req, res) => {
  const datasetsInfo = datasets.map(({ id, name, type, createdAt }) => ({
    //uses object literal shorthand like Same as { id: id, name: name }
    id,
    name,
    type,
    createdAt,
    dataPoints: datasets.find((d) => d.id === id)?.data.length || 0,
  }));
  res.json(datasetsInfo);
};

// Returns the data set that is requested by the frontend with the help of id
const getDataSetById = async (req, res) => {
  const dataset = datasets.find((d) => d.id === req.params.id);
  if (!dataset) {
    return res.status(404).json({ error: "Dataset not found" });
  }
  res.json(dataset);
};

const createDataSet = async (req, res) => {
  const { name, data, type } = req.body;

  if (!name || !data || !Array.isArray(data)) {
    return res.status(400).json({ error: "Invalid dataset format" });
  }

  const newDataset = {
    id: Date.now().toString(),
    name,
    data,
    type: type || "generic",
    createdAt: new Date().toISOString(),
  };

  datasets.push(newDataset);
  res.status(201).json(newDataset);
};

const generateDataSet = async (req, res) => {
  const { type } = req.params;
  const { count = 50, name = `Generated ${type} Data` } = req.body;

  let data = [];

  switch (type) {
    case "linear":
      data = Array.from({ length: count }, (_, i) => ({
        x: i,
        y: i * 2 + Math.random() * 10 - 5,
      }));
      break;

    case "normal":
      data = Array.from({ length: count }, () => {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return { value: z0 * 10 + 50 };
      });
      break;

    case "exponential":
      data = Array.from({ length: count }, (_, i) => ({
        x: i,
        y: Math.exp(i * 0.1) + Math.random() * 5,
      }));
      break;

    default:
      return res.status(400).json({ error: "Invalid data type" });
  }

  const newDataset = {
    id: Date.now().toString(),
    name,
    data,
    type: "generated",
    createdAt: new Date().toISOString(),
  };

  datasets.push(newDataset);
  res.json(newDataset);
};

const deleteDataSet = async (req, res) => {
  const datasetIndex = datasets.findIndex((d) => d.id === req.params.id);
  if (datasetIndex === -1) {
    return res.status(404).json({ error: "Dataset not found" });
  }

  datasets.splice(datasetIndex, 1);
  res.status(204).send();
};
module.exports = {
  getDataSet,
  getDataSetById,
  createDataSet,
  generateDataSet,
  deleteDataSet,
};
