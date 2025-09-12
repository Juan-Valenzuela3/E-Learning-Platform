import { useState, useCallback } from "react";


/**
 * Hook para poder alternar entre el estado de los formularios de login y registro
 *
 * @param {boolean} initialValue - Se maneja los valores iniciales del estado donde (true para login y false para registro)
 * @returns {{isLogin: boolean, handleLogin: function, handleRegister: function}}
 *
 */

export default function useFormToggle(initialValue = true){
  const [isLogin, setIsLogin]= useState(initialValue);

  const handleLogin = useCallback(()=>{
    setIsLogin(true)
  }, [])

  const handleRegister = useCallback(()=>{
    setIsLogin(false)
  }, [])

  return { isLogin, handleLogin, handleRegister }
}
