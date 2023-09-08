import mongoose from 'mongoose';

const { Schema } = mongoose;

const timesheetsSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    hours: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Timesheet', timesheetsSchema);
