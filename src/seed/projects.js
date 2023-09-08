import mongoose from 'mongoose';

export default [{
  _id: mongoose.Types.ObjectId('63531aaa2b654a3fb77054dd'),
  name: 'Goomess',
  description: 'This is a description',
  startDate: '11-10-2021',
  endDate: '07-10-2022',
  active: true,
  clientName: 'Martins',
  teamMembers: [
    {
      id: mongoose.Types.ObjectId('63531244ec6456efd12685ef'),
      role: 'DEV',
      rate: 100,
    },
  ],
}];
