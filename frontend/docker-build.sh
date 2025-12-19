#!/bin/bash

# Frontend Docker Build Script
# Para Linux/Mac

echo "🐳 Script de Build do Frontend"
echo ""

# Menu
echo "Escolha uma opção:"
echo "1 - Build Desenvolvimento"
echo "2 - Build Produção"
echo "3 - Run Desenvolvimento"
echo "4 - Run Produção"
echo "5 - Stop Containers"
echo "6 - Logs"
echo "7 - Limpar tudo"
echo ""

read -p "Digite o número da opção: " opcao

case $opcao in
    1)
        echo "🔨 Buildando imagem de desenvolvimento..."
        docker build --target development -t frontend-dev .
        echo "✅ Build concluído!"
        ;;
    2)
        echo "🔨 Buildando imagem de produção..."
        docker build --target production -t frontend-prod .
        echo "✅ Build concluído!"
        ;;
    3)
        echo "🚀 Iniciando container de desenvolvimento..."
        docker run -d -p 3000:3000 -v $(pwd):/app --name frontend-dev frontend-dev
        echo "✅ Container rodando em http://localhost:3000"
        ;;
    4)
        echo "🚀 Iniciando container de produção..."
        docker run -d -p 80:80 --name frontend-prod frontend-prod
        echo "✅ Container rodando em http://localhost"
        ;;
    5)
        echo "⏹️  Parando containers..."
        docker stop frontend-dev 2>/dev/null
        docker stop frontend-prod 2>/dev/null
        docker rm frontend-dev 2>/dev/null
        docker rm frontend-prod 2>/dev/null
        echo "✅ Containers parados e removidos!"
        ;;
    6)
        echo "📋 Logs dos containers:"
        echo "Dev:"
        docker logs --tail 20 frontend-dev 2>/dev/null
        echo ""
        echo "Prod:"
        docker logs --tail 20 frontend-prod 2>/dev/null
        ;;
    7)
        echo "🧹 Limpando tudo..."
        docker stop frontend-dev frontend-prod 2>/dev/null
        docker rm frontend-dev frontend-prod 2>/dev/null
        docker rmi frontend-dev frontend-prod 2>/dev/null
        echo "✅ Tudo limpo!"
        ;;
    *)
        echo "❌ Opção inválida!"
        ;;
esac
