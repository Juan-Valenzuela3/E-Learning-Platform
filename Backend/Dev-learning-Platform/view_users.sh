#!/bin/bash

echo "🚀 Dev Learning Platform - Visor de Usuarios"
echo "=============================================="

# Verificar si la aplicación está ejecutándose
echo "🔍 Verificando si la aplicación está ejecutándose..."
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Aplicación ejecutándose en http://localhost:8080"
    echo ""
    
    echo "🌐 Opciones para ver usuarios:"
    echo "1. Consola H2 (Recomendado):"
    echo "   - Abre: http://localhost:8080/h2-console"
    echo "   - JDBC URL: jdbc:h2:mem:testdb"
    echo "   - Usuario: sa"
    echo "   - Contraseña: password"
    echo "   - Ejecuta: SELECT * FROM users;"
    echo ""
    
    echo "2. API REST (requiere autenticación):"
    echo "   - Endpoint: http://localhost:8080/api/users/all"
    echo "   - Método: GET"
    echo "   - Headers: Authorization: Bearer <token>"
    echo ""
    
    echo "3. Login para obtener token:"
    echo "   - Endpoint: http://localhost:8080/api/auth/login"
    echo "   - Credenciales: admin@system.com / admin123"
    
else
    echo "❌ La aplicación NO está ejecutándose"
    echo ""
    echo "🚀 Para ejecutar la aplicación:"
    echo "   export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64"
    echo "   export PATH=\$JAVA_HOME/bin:\$PATH"
    echo "   mvn spring-boot:run"
fi

echo ""
echo "=============================================="
