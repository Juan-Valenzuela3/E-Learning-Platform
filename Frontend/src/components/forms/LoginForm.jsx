// src/components/forms/LoginForm.jsx
import { useState } from "react";
import FormInput from "@/components/common/FormInput";

// Este componente maneja el estado y la lógica del formulario de login
export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del login:", form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Correo Electrónico"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="tu@email.com"
      />
      <FormInput
        label="Contraseña"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="********"
      />
      <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg">
        Iniciar Sesión
      </button>
    </form>
  );
}