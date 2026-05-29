# Two-stage build: compile with Maven, run on a slim JRE.

# --- Build stage ---
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Maven wrapper + project descriptor first, so Docker layer caching can reuse
# the dependency download when only src/ changes.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# mvnw is a shell script. Repos developed on Windows often carry CRLF line
# endings that break the bash shebang on Linux. Strip them and make executable.
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

RUN ./mvnw -B dependency:go-offline

COPY src ./src
RUN ./mvnw -B -DskipTests clean package

# --- Runtime stage ---
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV JAVA_OPTS=""
EXPOSE 8080
# Render injects PORT; fall back to 8080 locally.
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
