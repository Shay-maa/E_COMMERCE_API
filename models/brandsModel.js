const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name required"],
      minLength: [2, "Name should be more than 2 characters"],
      maxLength: [50, "Name should be less than 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const imageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post("init", (doc) => {
  imageURL(doc);
});
brandSchema.post("save", (doc) => {
  imageURL(doc);
});

const brandModel = mongoose.model("Brand", brandSchema);
module.exports = brandModel;
