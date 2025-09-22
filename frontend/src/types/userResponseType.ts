export default interface UserResponseProps {
  id: string;
  role: string;
  name: string;
  email: string;
  token: string;
  created_at: string | Date;
  updated_at: string | Date;
}
