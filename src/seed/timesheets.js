import mongoose from 'mongoose';

export default [{
  _id: mongoose.Types.ObjectId('63531fd7410c845909ab22e7'),
  date: '2022-10-20T00:00:00.000+00:00',
  task: mongoose.Types.ObjectId('63531a7c73636855c2aa7f9a'),
  description: 'Backend',
  project: mongoose.Types.ObjectId('63531aaa2b654a3fb77054dd'),
  employee: mongoose.Types.ObjectId('63531244ec6456efd12685ef'),
  hours: 8,
}];
