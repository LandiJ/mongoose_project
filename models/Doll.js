var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var dollSchema = new Schema({
  hair: {
    color: String,
    texture: {
      type: String,
      enum: ["straight", "curly"]
    }
  },
  cost: {
    type: Number
  },
  owner: {
    type: [String]
  }
});
var Doll = mongoose.model("Doll", dollSchema);
module.exports = Doll;
