plugins {
    id("com.android.application")
}

android {
    namespace = "com.forgefit.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.forgefit.premium"
        minSdk = 26
        targetSdk = 35
        versionCode = 3
        versionName = "0.2.1"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
}

dependencies {
    implementation("androidx.core:core:1.15.0")
}
