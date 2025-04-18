// Assuming you already have express, mongoose, etc. setup
app.get("/api/activities", async (req, res) => {
    try {
      const activities = await ActivityModel.find(); // Replace with your model
      res.json(activities);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });
  