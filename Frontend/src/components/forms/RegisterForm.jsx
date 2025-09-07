import { useState } from "react";
import FormInput from "../common/FormInput";

import {
  SquareUser,
  GraduationCap,
  BriefcaseBusiness,
  ShieldHalf,
} from "lucide-react";



export default function RegisterForm() {
  
  const [ form, setForm]= useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "student",
    acceptTerms: false,
    receiveUpdates: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario de registro:", form);
    // Aquí pondre la logica para emviar los datos mediante la api
  };
  const handleAccountTypeChange = (type) => {
    setForm((prevForm) => ({
      ...prevForm,
      accountType: type,
    }));
  };
  const accountTypes =[
    {
      type:"Student",
      label:"Estudiante",
      description: "Accede a cursos y materiales de aprendizaje",
      icon: <GraduationCap/>
    },
    {
      type: "instructor",
      label: "Instructor",
      description: "Crea y gestiona cursos educativos",
      icon: <BriefcaseBusiness />,
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Nombre"
          name="firstName"
          type="text"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Tu nombre"
        />
        <FormInput
          label="Apellido"
          name="lastName"
          type="text"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Tu apellido"
        />
      </div>

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
        placeholder="Mínimo 8 caracteres"
      />
      <FormInput
        label="Confirmar Contraseña"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Confirma tu contraseña"
      />

      {/* Sección para el tipo de cuenta */}
      <div className="text-left pt-4">
        <p className="block text-gray-700 font-medium mb-2">Tipo de Cuenta</p>
        <div className="grid grid-cols-3 gap-4">
          {accountTypes.map((accType) => (
            <div
              key={accType.type}
              onClick={() => handleAccountTypeChange(accType.type)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                form.accountType === accType.type
                  ? "border-black bg-black text-white shadow-lg"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              <div className="flex justify-center text-4xl mb-2">{accType.icon}</div>
              <p className="font-semibold text-sm">{accType.label}</p>
              <p className="text-xs">{accType.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Checkboxes de Términos y Condiciones */}
      <div className="flex flex-col space-y-2 text-left text-sm">
        <label className="flex items-center text-gray-700">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={form.acceptTerms}
            onChange={handleChange}
            className="mr-2"
            required
          />
          <a href="http://">Acepto los <span className="text-red-500 font-medium ml-1">Términos de Servicio</span></a> <spam className='ml-1' > y </spam>
          <a href="">
            <span className="text-red-500 font-medium ml-1">Política de Privacidad</span>
            </a>

        </label>
        <label className="flex items-center text-gray-700">
          <input
            type="checkbox"
            name="receiveUpdates"
            checked={form.receiveUpdates}
            onChange={handleChange}
            className="mr-2"
          />
          Quiero recibir actualizaciones y noticias por correo electrónico
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 mt-4"
      >
        Crear Cuenta
      </button>

      <div className="text-sm mt-4 text-center">
        ¿Ya tienes una cuenta?{" "}
        <span className="text-red-500 font-medium cursor-pointer">
          Iniciar Sesión
        </span>
      </div>
    </form>
  );

}