import { Button } from "@/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DataPolicy() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Protección de Datos</h1>
        
        <p className="text-gray-600 mb-6">
          Última actualización: 2 de septiembre de 2025
        </p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Responsable del Tratamiento</h2>
            <p className="text-gray-700 mb-4">
              Los datos personales recabados a través de este sitio web serán tratados por [Nombre de la Empresa], 
              con CIF [Número de CIF] y domicilio en [Dirección completa], como responsable del tratamiento de datos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Finalidad del Tratamiento</h2>
            <p className="text-gray-700 mb-4">
              Los datos personales serán utilizados para las siguientes finalidades:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Gestión de usuarios y acceso a la plataforma educativa</li>
              <li>Provisión de servicios formativos y soporte al estudiante</li>
              <li>Envío de comunicaciones relacionadas con los servicios contratados</li>
              <li>Gestión de pagos y facturación</li>
              <li>Mejora de la experiencia del usuario</li>
              <li>Cumplimiento de obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Base Jurídica del Tratamiento</h2>
            <p className="text-gray-700 mb-4">
              La base jurídica para el tratamiento de sus datos es la ejecución del contrato de prestación de servicios educativos. 
              Para el envío de comunicaciones comerciales, la base jurídica será el consentimiento del interesado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Cesión de Datos</h2>
            <p className="text-gray-700 mb-4">
              No se cederán datos a terceros, salvo obligación legal o que sea necesario para la prestación del servicio contratado 
              (por ejemplo, plataformas de pago o proveedores de servicios tecnológicos).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Derechos de los Interesados</h2>
            <p className="text-gray-700 mb-4">
              Como titular de los datos, tiene derecho a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Acceder a sus datos personales</li>
              <li>Solicitar la rectificación de datos inexactos</li>
              <li>Solicitar la supresión de sus datos</li>
              <li>Oponerse al tratamiento de sus datos</li>
              <li>Solicitar la limitación del tratamiento</li>
              <li>Derecho a la portabilidad de los datos</li>
              <li>Revocar el consentimiento prestado</li>
            </ul>
            <p className="text-gray-700">
              Para ejercer estos derechos, puede enviar una solicitud a [correo electrónico de protección de datos] o por correo postal a nuestra dirección.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Plazo de Conservación</h2>
            <p className="text-gray-700 mb-4">
              Los datos personales se conservarán mientras se mantenga la relación contractual y, una vez finalizada, 
              durante los plazos legales aplicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Medidas de Seguridad</h2>
            <p className="text-gray-700 mb-4">
              Hemos implementado medidas técnicas y organizativas para garantizar la seguridad de sus datos personales 
              y protegerlos contra accesos no autorizados, pérdida o destrucción accidental.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Cambios en la Política de Privacidad</h2>
            <p className="text-gray-700">
              Nos reservamos el derecho a modificar esta política para adaptarla a novedades legislativas o jurisprudenciales. 
              Se recomienda su revisión periódicamente.
            </p>
          </section>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Si tiene cualquier duda sobre esta política de protección de datos, puede contactarnos en [correo electrónico de contacto].
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
