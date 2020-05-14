import mongoose, { Schema, Document } from 'mongoose';

export interface IClass {
  schoolId?: string;
  name?: string;
}

interface IClassSchema extends IClass, Document {
  students?: Schema.Types.ObjectId[];
}

const ClassSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, unique: false, ref: 'School' },
  name: { type: String, required: true, unique: false },
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
});

export default mongoose.model<IClassSchema>('Classs', ClassSchema);
