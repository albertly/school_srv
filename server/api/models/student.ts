import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent {
  classId?: string;
  tz?: string;
  name?: string;
}

interface IStudentSchema extends IStudent, Document {
  grades?: Schema.Types.ObjectId[];
}

const StudentSchema: Schema = new Schema({
  classId: { type: Schema.Types.ObjectId, unique: false, ref: 'classs' },
  tz: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  grades: [{ type: Schema.Types.ObjectId, ref: 'grade' }],
});

export default mongoose.model<IStudentSchema>('Student', StudentSchema);
