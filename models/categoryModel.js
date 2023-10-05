const mongoose = require("mongoose");

//create schema

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name required"],
      unique: [true, "Category must be unique"],
      minlength: [2, "Too short category name"],
      maxlength: [36, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    //updated at / created at
    timestamps: true,
  }
);

const imageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post("init", (doc) => {
  imageURL(doc);
});
categorySchema.post("save", (doc) => {
  imageURL(doc);
});

//create model

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;
