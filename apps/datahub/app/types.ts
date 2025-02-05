export interface Teacher {
  id?: string;
  name: string;
  gender: string;
  yearOfBirth: number;
  zip: string;
  courses: string[];
  subjects: string[];
  emailAddress?: string;
  phoneNumber?: string;
}
