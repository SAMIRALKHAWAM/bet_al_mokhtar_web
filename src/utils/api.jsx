export const BASE_URL = 'https://samir.comma-test.com/api/admin';
// export const BASE_URL = 'http://192.168.17.1:8000/api/admin';
export const BASE_IMAGE_URL = 'https://samir.comma-test.com/storage/';
export const getUser = () => JSON.parse(localStorage.getItem("user"));
export const gettype = () => localStorage.getItem("type");

// export const gettype = "admin";

export const getBranchId = () => {
  const user = getUser();
  if (!user) return null;
  console.log("user.type:"+user.type);
  if (user.type === 'subadmin') {
    const branchIdFromStorage = localStorage.getItem('branch_id');
    return branchIdFromStorage ? Number(branchIdFromStorage) : null;
  } else {
    const pathParts = window.location.pathname.split('/');
    const branchIdFromUrl = Number(pathParts[2]);
    return branchIdFromUrl > 0 ? branchIdFromUrl : null;
  }
};


// export const getBranchId = () => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   if (!user) return null;

//   if (user.type === 'subadmin') {
//     // جرب هاد المفتاح ولاحظ المفتاح الصحيح في التخزين
//     const branchIdFromStorage = localStorage.getItem('branchId') || localStorage.getItem('branch_id');
//     return branchIdFromStorage ? Number(branchIdFromStorage) : null;
//   } else {
//     // نحاول ناخد الفرع من الرابط
//     const pathParts = window.location.pathname.split('/');
//     const branchIdFromUrl = Number(pathParts[2]);
//     return branchIdFromUrl > 0 ? branchIdFromUrl : null;
//   }
// };


// export const getBranchId = () => {
//   return localStorage.getItem("branch_id");
// };

// export const getBranchId = () => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   if (!user) return null;

//   return user.type === 'subadmin' 
//     ? Number(localStorage.getItem('branch_id'))
//     : Number(window.location.pathname.split('/')[2]); // من الرابط
// };