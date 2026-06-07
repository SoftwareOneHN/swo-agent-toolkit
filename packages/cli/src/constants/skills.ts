import { Framework } from './enums';

/**
 * SkillDetection defines how to automatically enable a skill based on project dependencies.
 */
export interface SkillDetection {
  /** The skill ID as defined in the registry (e.g., 'riverpod-state-management') */
  id: string;
  /** List of npm or pub packages that indicate this skill is used */
  packages: string[];
  /** Optional list of root folder/file paths (relative to cwd). If any exist, the skill is detected. */
  files?: string[];
}

/**
 * Registry of automatic skill detection rules grouped by framework.
 */
export const SKILL_DETECTION_REGISTRY: Record<string, SkillDetection[]> = {
  [Framework.Flutter]: [
    {
      id: 'flutter-riverpod-state-management',
      packages: ['flutter_riverpod', 'riverpod'],
    },
    {
      id: 'flutter-bloc-state-management',
      packages: ['flutter_bloc', 'bloc'],
    },
    {
      id: 'flutter-auto-route-navigation',
      packages: ['auto_route'],
    },
    {
      id: 'flutter-go-router-navigation',
      packages: ['go_router'],
    },
    {
      id: 'flutter-getx-navigation',
      packages: ['get'], // Special handling for exact match required
    },
    {
      id: 'flutter-getx-state-management',
      packages: ['get'], // Special handling for exact match required
    },
    {
      id: 'flutter-localization',
      packages: ['easy_localization'],
    },
    {
      id: 'flutter-retrofit-networking',
      packages: ['retrofit'],
    },
    {
      id: 'flutter-dependency-injection',
      packages: ['get_it', 'injectable'],
    },
  ],
  [Framework.NestJS]: [
    {
      id: 'nestjs-caching',
      packages: ['@nestjs/cache-manager', 'cache-manager'],
    },
    {
      id: 'nestjs-database',
      packages: ['@nestjs/typeorm', '@nestjs/prisma', '@nestjs/mongoose'],
    },
    {
      id: 'nestjs-security',
      packages: ['@nestjs/passport', 'passport', 'helmet'],
    },
  ],
  [Framework.Android]: [
    {
      id: 'android-compose',
      packages: ['androidx.compose.ui'],
      files: ['android', 'build.gradle', 'build.gradle.kts'],
    },
    {
      id: 'android-navigation',
      packages: ['androidx.navigation:navigation-compose'],
      files: ['android', 'build.gradle', 'build.gradle.kts'],
    },
    {
      id: 'android-legacy-navigation',
      packages: [
        'androidx.navigation:navigation-fragment',
        'androidx.navigation:navigation-ui',
      ],
      files: ['android', 'build.gradle', 'build.gradle.kts'],
    },
    {
      id: 'android-di',
      packages: ['hilt-android', 'dagger-android'],
      files: ['android', 'build.gradle', 'build.gradle.kts'],
    },
    {
      id: 'android-persistence',
      packages: ['androidx.room:room-runtime'],
      files: ['android', 'build.gradle', 'build.gradle.kts'],
    },
    {
      id: 'android-networking',
      packages: ['retrofit'],
      files: ['android', 'build.gradle', 'build.gradle.kts'],
    },
    {
      id: 'android-concurrency',
      packages: ['kotlinx-coroutines-android'],
      files: ['android', 'build.gradle', 'build.gradle.kts'],
    },
  ],
  [Framework.iOS]: [
    {
      id: 'ios-networking',
      packages: ['Alamofire', 'Moya'],
      files: ['ios', 'Podfile', 'Package.swift'],
    },
    {
      id: 'ios-dependency-injection',
      packages: ['Swinject', 'Resolver'],
      files: ['ios', 'Podfile', 'Package.swift'],
    },
    {
      id: 'ios-persistence',
      packages: ['Realm', 'CoreData', 'SQLite.swift'],
      files: ['ios', 'Podfile', 'Package.swift'],
    },
    {
      id: 'ios-state-management',
      packages: ['ComposableArchitecture', 'CombineRuntime'],
      files: ['ios', 'Podfile', 'Package.swift'],
    },
    {
      id: 'ios-ui-navigation',
      packages: ['Coordinator', 'Router'],
      files: ['ios', 'Podfile', 'Package.swift'],
    },
  ],
  [Framework.ReactNative]: [
    {
      id: 'react-native-navigation',
      packages: ['@react-navigation/native'],
    },
    {
      id: 'react-native-state-management',
      packages: ['zustand', '@reduxjs/toolkit'],
    },
    {
      id: 'react-native-deployment',
      packages: ['react-native-code-push', 'expo-updates'],
    },
    {
      id: 'react-native-security',
      packages: ['react-native-keychain', 'react-native-ssl-pinning'],
    },
    {
      id: 'react-native-performance',
      packages: ['react-native-fast-image'],
    },
  ],
  [Framework.Laravel]: [
    {
      id: 'laravel-api',
      packages: ['laravel/sanctum', 'laravel/passport'],
    },
    {
      id: 'laravel-background-processing',
      packages: ['laravel/horizon'],
    },
    {
      id: 'laravel-testing',
      packages: ['pestphp/pest', 'phpunit/phpunit'],
    },
    {
      id: 'laravel-tooling',
      packages: ['laravel/pint', 'laravel/sail'],
    },
    {
      id: 'laravel-database-expert',
      packages: ['laravel/framework'], // Always present, but used for sub-skill mapping
    },
  ],
  [Framework.NextJS]: [
    {
      id: 'nextjs-pages-router',
      packages: [],
      files: ['pages', 'src/pages'],
    },
    {
      id: 'nextjs-server-components',
      packages: [],
      files: ['app', 'src/app'],
    },
    {
      id: 'nextjs-server-actions',
      packages: [],
      files: ['app', 'src/app'],
    },
    {
      id: 'nextjs-data-fetching',
      packages: [],
      files: ['app', 'src/app'],
    },
    {
      id: 'nextjs-i18n',
      packages: ['next-intl', 'react-intl', 'next-translate', 'i18next'],
      files: [
        'middleware.ts',
        'app/[lang]',
        'pages/[locale]',
        'next.config.js',
      ],
    },
  ],
  [Framework.React]: [
    {
      id: 'react-styling',
      packages: ['tailwind', 'antd', 'sass', 'styled-components', 'emotion'],
    },
    {
      id: 'react-state-management',
      packages: [
        'redux',
        '@reduxjs/toolkit',
        'zustand',
        'mobx',
        'recoil',
        'jotai',
      ],
    },
    {
      id: 'react-testing',
      packages: [
        'jest',
        'vitest',
        '@testing-library/react',
        'cypress',
        'playwright',
      ],
    },
  ],
  database: [
    {
      id: 'database-postgresql',
      packages: ['pg', 'pgx', 'postgres', 'sequelize', 'typeorm', 'prisma'],
    },
    {
      id: 'database-mongodb',
      packages: ['mongodb', 'mongoose'],
    },
    {
      id: 'database-redis',
      packages: ['redis', 'ioredis', 'predis'],
    },
  ],
};
