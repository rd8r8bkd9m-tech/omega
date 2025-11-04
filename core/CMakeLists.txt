cmake_minimum_required(VERSION 3.10)
project(KolibriCore C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall -Wextra -O2")

# Core library
add_library(kolibri_core STATIC
    src/kolibri_core.c
)

target_include_directories(kolibri_core PUBLIC include)

# Chain library
add_library(kolibri_chain STATIC
    ../chain/src/kolibri_chain.c
)

target_include_directories(kolibri_chain PUBLIC ../chain/include)

# Combined library
add_library(kolibri STATIC
    src/kolibri_core.c
    ../chain/src/kolibri_chain.c
)

target_include_directories(kolibri PUBLIC include ../chain/include)

# Install targets
install(TARGETS kolibri kolibri_core kolibri_chain
    ARCHIVE DESTINATION lib
)

install(FILES include/kolibri_core.h ../chain/include/kolibri_chain.h
    DESTINATION include
)
