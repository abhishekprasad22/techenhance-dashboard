const pool = require("../db");

const getRecommendations = async (req, res) => {
    try{
        //Machine Learning model logic would go here

        //The output of machine learning model will be stored in a table

        // For now, we will simulate recommendations with a simple query

        const result = await pool.query("SELECT * FROM recommendations");
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No recommendations found" });
        }

        return res.json(result.rows);
    }
    catch(error){
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getRecommendations,
};