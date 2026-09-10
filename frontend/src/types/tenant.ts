export interface Tenant {
  id: number;
  name: string;
  store_name: string;
  contact_email: string;
  contact_phone: string;
  domain?: string | null;
  subdomain: string;
  is_active: boolean;
  created_at: string;
}
