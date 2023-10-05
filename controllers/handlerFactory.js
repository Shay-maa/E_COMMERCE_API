const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiErrors");
const ApiFeatures = require("../utils/apiFeatures");

exports.delete = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`no such document with id  ${id}`, 404));
    }
    res.status(204).send();
  });

exports.update = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`no such document with id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

exports.create = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(
        new ApiError(`No such document with Id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build Query || preparation
    const documentsCounts = await Model.countDocuments(); // countDocuments built in function
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .search()
      .sort()
      .filter()
      .paginate(documentsCounts)
      .limitFields();
    //Execute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ result: documents.length, paginationResult, data: documents });
  });
