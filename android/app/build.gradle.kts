plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.ganapathiraj.shootandhide"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.ganapathiraj.shootandhide"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    implementation(libs.androidx.core.ktx)
}
