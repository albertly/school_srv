import mongoose, { Schema, Document } from 'mongoose';

export interface ISchool {
  name?: string;
  logo?: string;
  motor?: string;
}

interface ISchoolSchema extends ISchool, Document {
  classes?: Schema.Types.ObjectId[];
}

const SchoolSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String, required: true },
  motor: { type: String, required: true },
  classes: [{ type: Schema.Types.ObjectId, ref: 'Classs' }],
});

export default mongoose.model<ISchoolSchema>('School', SchoolSchema);
