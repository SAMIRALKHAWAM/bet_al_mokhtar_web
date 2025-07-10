import { BASE_URL } from "../utils/api";

export const fetchBranches = async () => {
  const res = await fetch(`${BASE_URL}/get_branches`);
  const data = await res.json();
  if (data.success) return data.data;
  throw new Error(data.message || 'Failed to fetch branches');
};

export const createBranch = async (branch) => {
  const res = await fetch(`${BASE_URL}/create_branch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: branch.name,
      location: branch.location,
    }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to create branch');
  return data;
};

export const updateBranch = async (id, branch) => {
  const res = await fetch(`${BASE_URL}/update_one_branch/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: branch.name,
      location: branch.location,
    }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update branch');
  return data;
};

export const deleteBranch = async (id) => {
  const res = await fetch(`${BASE_URL}/delete_one_branch/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to delete branch');
  return data;
};
