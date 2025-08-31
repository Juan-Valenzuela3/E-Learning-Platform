#!/usr/bin/env python3
"""
Script para probar endpoints públicos de la API
No requiere credenciales ni autenticación
"""

import requests
import json
from datetime import datetime

def test_public_endpoints():
    """Función principal para probar endpoints públicos"""
    
    base_url = "http://localhost:8080"
    
    print("🚀 Probando Endpoints Públicos de la API")
    print("=" * 50)
    print(f"🌐 URL Base: {base_url}")
    print(f"⏰ Hora de prueba: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Lista de endpoints públicos a probar
    endpoints = [
        {
            "name": "Saludo Público",
            "url": "/api/public/hello",
            "method": "GET",
            "description": "Endpoint de saludo sin autenticación"
        },
        {
            "name": "Información Pública",
            "url": "/api/public/info",
            "method": "GET",
            "description": "Información general de la plataforma"
        },
        {
            "name": "Usuarios Públicos",
            "url": "/api/public/users",
            "method": "GET",
            "description": "Lista de usuarios (sin información sensible)"
        },
        {
            "name": "Estadísticas Públicas",
            "url": "/api/public/stats",
            "method": "GET",
            "description": "Estadísticas del sistema"
        }
    ]
    
    results = []
    
    for endpoint in endpoints:
        print(f"🔍 Probando: {endpoint['name']}")
        print(f"   📍 URL: {endpoint['url']}")
        print(f"   📝 Descripción: {endpoint['description']}")
        
        try:
            # Hacer la petición HTTP
            response = requests.get(f"{base_url}{endpoint['url']}", timeout=10)
            
            if response.status_code == 200:
                print(f"   ✅ Estado: {response.status_code} (Éxito)")
                
                # Mostrar respuesta
                if endpoint['url'] == "/api/public/users":
                    users = response.json()
                    print(f"   👥 Usuarios encontrados: {len(users)}")
                    for i, user in enumerate(users, 1):
                        print(f"      {i}. {user.get('userName', 'N/A')} {user.get('lastName', 'N/A')} ({user.get('role', 'N/A')})")
                else:
                    print(f"   📄 Respuesta: {response.text[:100]}...")
                
                results.append({"endpoint": endpoint['name'], "status": "✅ Éxito", "code": response.status_code})
                
            else:
                print(f"   ❌ Estado: {response.status_code} (Error)")
                print(f"   📄 Respuesta: {response.text}")
                results.append({"endpoint": endpoint['name'], "status": "❌ Error", "code": response.status_code})
                
        except requests.exceptions.ConnectionError:
            print(f"   ❌ Error: No se puede conectar a {base_url}")
            results.append({"endpoint": endpoint['name'], "status": "❌ Sin conexión", "code": "N/A"})
            
        except Exception as e:
            print(f"   ❌ Error inesperado: {e}")
            results.append({"endpoint": endpoint['name'], "status": "❌ Error", "code": "N/A"})
        
        print()
    
    # Resumen de resultados
    print("📊 Resumen de Pruebas")
    print("=" * 30)
    for result in results:
        print(f"{result['status']} - {result['endpoint']} (Código: {result['code']})")
    
    print()
    print("🎯 Endpoints Públicos Disponibles:")
    print("   • GET /api/public/hello - Saludo público")
    print("   • GET /api/public/info - Información de la plataforma")
    print("   • GET /api/public/users - Lista de usuarios (pública)")
    print("   • GET /api/public/stats - Estadísticas del sistema")
    
    print()
    print("💡 Para probar manualmente:")
    print(f"   • curl {base_url}/api/public/hello")
    print(f"   • curl {base_url}/api/public/users")
    print(f"   • curl {base_url}/api/public/stats")

if __name__ == "__main__":
    test_public_endpoints()
