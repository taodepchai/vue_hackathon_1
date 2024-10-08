<template>
  <div>
    <h2>User Manager</h2>
    <button style="background-color: blue" @click="openModal('add')">
      Add User
    </button>
    <input
      v-model="searchQuery"
      placeholder="Search email"
      @input="searchEmployee"
      ref="searchInput"
    />
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Full name</th>
          <th>Gender</th>
          <th>Date of Birth</th>
          <th>Email</th>
          <th>Option</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(employee, index) in filteredEmployees" :key="employee.id">
          <td>{{ index + 1 }}</td>
          <td>{{ employee.name }}</td>
          <td>{{ employee.gender }}</td>
          <td>{{ employee.dob }}</td>
          <td>{{ employee.email }}</td>
          <td>
            <button
              style="background-color: orange"
              @click="openModal('edit', index)"
            >
              Edit
            </button>
            <button
              style="background-color: red"
              id="delete"
              @click="deleteEmployee(index)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? "Edit user" : "Add user" }}</h3>
        <form @submit.prevent="saveEmployee">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="employeeForm.name"
            placeholder="Full name"
            required
          />

          <label for="gender">Gender</label>
          <div id="gender">
            <input
              type="radio"
              id="male"
              value="Male"
              v-model="employeeForm.gender"
            />
            <label for="male">Male</label>
            <input
              type="radio"
              id="female"
              value="Female"
              v-model="employeeForm.gender"
            />
            <label for="female">Female</label>
            <input
              type="radio"
              id="other"
              value="Other"
              v-model="employeeForm.gender"
            />
            <label for="other">Other</label>
          </div>

          <label for="dob">Date Of Birth</label>
          <input id="dob" v-model="employeeForm.dob" type="date" required />

          <label for="email">Email</label>
          <input
            id="email"
            v-model="employeeForm.email"
            type="email"
            placeholder="Email"
            required
          />

          <div class="modal-actions">
            <button
              style="background-color: gray"
              type="button"
              @click="closeModal"
            >
              Close
            </button>
            <button style="background-color: blue" type="submit">
              {{ isEditing ? "Save" : "Add" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const employees = ref([]);
const employeeForm = ref({
  name: "",
  gender: "Male",
  dob: "",
  email: "",
});
const showModal = ref(false);
const isEditing = ref(false);
const currentIndex = ref(null);
const searchQuery = ref("");
const searchInput = ref(null);
const loadEmployees = () => {
  const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.value = storedEmployees;
};

const saveEmployees = () => {
  localStorage.setItem("employees", JSON.stringify(employees.value));
};

const saveEmployee = () => {
  const today = new Date();
  const dob = new Date(employeeForm.value.dob);

  if (dob > today) {
    Swal.fire({
      icon: "error",
      title: "Invalid Date of Birth",
      text: "The date of birth cannot be later than today.",
    });
    return;
  }

  const emailExists = employees.value.some((employee, index) => {
    return (
      employee.email === employeeForm.value.email &&
      index !== currentIndex.value
    );
  });

  if (emailExists) {
    Swal.fire({
      icon: "error",
      title: "Duplicate Email",
      text: "The email is already in use. Please use a different email.",
    });
    return;
  }

  if (isEditing.value) {
    employees.value[currentIndex.value] = { ...employeeForm.value };
  } else {
    employees.value.push({ ...employeeForm.value, id: Date.now() });
  }
  saveEmployees();
  closeModal();
};

const openModal = (action, index = null) => {
  if (action === "add") {
    isEditing.value = false;
    resetForm();
  } else if (action === "edit") {
    isEditing.value = true;
    currentIndex.value = index;
    employeeForm.value = { ...employees.value[index] };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const deleteEmployee = (index) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, keep it",
  }).then((result) => {
    if (result.isConfirmed) {
      employees.value.splice(index, 1);
      saveEmployees();
      Swal.fire("Deleted!", "The user has been deleted.", "success");
    }
  });
};

const filteredEmployees = computed(() => {
  return employees.value.filter((employee) =>
    employee.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const resetForm = () => {
  employeeForm.value = { name: "", gender: "Male", dob: "", email: "" };
  currentIndex.value = null;
};

onMounted(() => {
  searchInput.value.focus();
  loadEmployees();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-content label {
  display: block;
  margin-bottom: 5px;
}

.modal-content input[type="text"],
.modal-content input[type="date"],
.modal-content input[type="email"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: left;
}

button {
  margin-right: 5px;
  padding: 10px 10px;
  border: none;
  border-radius: 5px;
  color: white;
}

input {
  width: 300px;
  height: 30px;
}
</style>
