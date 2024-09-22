export type Permission = "view" | "create" | "edit" | "delete";

export type ResourcePermissions = {
  [resource: string]: Permission[];
};

export type Role = {
  name: string;
  permissions: ResourcePermissions;
};

type User = {
  name: string;
  id_list: string[];
  roles: string[];
  customPermissions?: ResourcePermissions;
};

export const adminRole: Role = {
  name: "admin",
  permissions: {
    item: ["view", "create", "edit", "delete"],
    storage: ["view", "create", "edit", "delete"],
    user: ["view", "edit"],
  },
};

export const viewerRole: Role = {
  name: "viewer",
  permissions: {
    item: ["view"],
    storage: ["view"],
  },
};

export default User