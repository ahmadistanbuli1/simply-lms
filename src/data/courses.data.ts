export interface CourseInputConfig {
  id: string;
  name: "title" | "description";
  type: string;
  label: string;
  placeholder: string;
}

export const CREATE_COURSE_INPUTS: CourseInputConfig[] = [
  {
    id: "title",
    name: "title",
    type: "text",
    label: "Title Of Course",
    placeholder: "ex. Next.js Course",
  },
  {
    id: "description",
    name: "description",
    type: "text",
    label: "Description Of Cousre",
    placeholder: "ex. Learning Next.js And Deepth Tasks",
  },
];
