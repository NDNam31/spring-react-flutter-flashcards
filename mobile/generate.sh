#!/bin/bash

# Flutter Build Script for Code Generation
# Run this script whenever you add/modify Drift tables, Freezed models, or JSON serializable classes

echo "🚀 Starting Flutter code generation..."
echo ""

# Clean previous builds
echo "📦 Cleaning previous builds..."
flutter clean
flutter pub get

echo ""
echo "⚙️ Running build_runner..."
flutter pub run build_runner build --delete-conflicting-outputs

echo ""
echo "✅ Code generation complete!"
echo ""
echo "Generated files:"
echo "  - *.g.dart (Drift tables, JSON serialization)"
echo "  - *.freezed.dart (Freezed models)"
echo ""
echo "You can now run: flutter run"
