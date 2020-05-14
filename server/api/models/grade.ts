import mongoose, { Schema, Document } from 'mongoose';

export interface IGrade {
  studentId?: string;
  subject?: string;
  year?: number;
  first?: number;
  second?: number;
}

interface IGradeSchema extends IGrade, Document {}

const GradeSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, unique: false, ref: 'student' },
  subject: { type: String, required: true },
  year: { type: Number, required: true },
  first: { type: Number, required: false },
  second: { type: Number, required: false },
});

export default mongoose.model<IGradeSchema>('Grade', GradeSchema);
