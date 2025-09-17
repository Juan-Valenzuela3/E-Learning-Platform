import {useNavigate} from 'react-router-dom'
import RegisterForm from '@/features/auth/components/forms/RegisterForm'
import logo from '@/assets/logo.svg'


export default function RegisterPage(){
    const navigate = useNavigate();
    return(
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    {/* Logo y título */}
                    <div className="text-center mb-8">
                        <img 
                            src={logo} 
                            alt="EduPlatform Logo" 
                            className="h-16 w-16 mx-auto mb-4" 
                        />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Crea tu cuenta
                        </h1>
                        <p className="text-gray-600">
                            Únete a nuestra plataforma de aprendizaje
                        </p>
                    </div>
                    
                    {/* Formulario de registro */}
                    <RegisterForm />
                    
                    {/* Enlace a inicio de sesión */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <button
                                onClick={() => navigate('/authentication')}
                                className="font-medium text-red-500 hover:text-red-600 transition-colors"
                            >
                                Inicia sesión
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}