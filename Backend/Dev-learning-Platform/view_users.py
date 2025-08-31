#!/usr/bin/env python3
"""
Script para ver usuarios de la aplicación Dev Learning Platform
Ejecutar: python3 view_users.py
"""

import requests
import json
from datetime import datetime

def view_users():
    """Función principal para ver usuarios"""
    
    # URL base de la aplicación
    base_url = "http://localhost:8080"
    
    print("🔍 Verificando usuarios en Dev Learning Platform...")
    print("=" * 50)
    
    try:
        # Intentar obtener todos los usuarios
        response = requests.get(f"{base_url}/api/users/all", timeout=10)
        
        if response.status_code == 200:
            users = response.json()
            print(f"✅ Usuarios encontrados: {len(users)}")
            print()
            
            for i, user in enumerate(users, 1):
                print(f"👤 Usuario {i}:")
                print(f"   📧 Email: {user.get('email', 'N/A')}")
                print(f"   👤 Nombre: {user.get('userName', 'N/A')}")
                print(f"   📝 Apellido: {user.get('lastName', 'N/A')}")
                print(f"   🏷️  Rol: {user.get('role', 'N/A')}")
                print(f"   ✅ Activo: {'Sí' if user.get('isActive') else 'No'}")
                print(f"   📅 Creado: {user.get('createdAt', 'N/A')}")
                print()
                
        elif response.status_code == 401:
            print("❌ Error: No autorizado. La aplicación requiere autenticación.")
            print("💡 Para ver usuarios, necesitas un token JWT válido.")
            print()
            print("🔑 Opciones para obtener un token:")
            print("   1. Usar la consola H2: http://localhost:8080/h2-console")
            print("   2. Hacer login con admin@system.com / admin123")
            print("   3. Usar el endpoint /api/auth/login")
            
        else:
            print(f"❌ Error HTTP: {response.status_code}")
            print(f"Respuesta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar a la aplicación.")
        print("💡 Asegúrate de que la aplicación esté ejecutándose en http://localhost:8080")
        print()
        print("🚀 Para ejecutar la aplicación:")
        print("   cd Backend/Dev-learning-Platform")
        print("   export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64")
        print("   export PATH=$JAVA_HOME/bin:$PATH")
        print("   mvn spring-boot:run")
        
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

def view_h2_console():
    """Mostrar información sobre la consola H2"""
    print("🌐 Alternativa: Consola H2")
    print("=" * 30)
    print("Puedes ver los usuarios directamente en la base de datos:")
    print("1. Abre tu navegador")
    print("2. Ve a: http://localhost:8080/h2-console")
    print("3. Configuración:")
    print("   - JDBC URL: jdbc:h2:mem:testdb")
    print("   - Usuario: sa")
    print("   - Contraseña: password")
    print("4. Ejecuta: SELECT * FROM users;")

if __name__ == "__main__":
    print("🚀 Dev Learning Platform - Visor de Usuarios")
    print("=" * 50)
    
    # Intentar ver usuarios via API
    view_users()
    
    print()
    print("=" * 50)
    
    # Mostrar alternativa H2
    view_h2_console()
