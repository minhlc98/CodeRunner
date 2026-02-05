CREATE DATABASE coderunner;

CREATE TABLE IF NOT EXISTS programming_languages (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,          -- Python, Java, Typescript
    file_extension VARCHAR(10) NOT NULL,-- py, js
    docker_image TEXT,                  -- python:3.11-alpine
    run_command TEXT NOT NULL,          -- python main.py
    is_active BOOLEAN DEFAULT true,
    timeout int DEFAULT 0,
    default_code text,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS runner (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	programming_language_id UUID NOT NULL,
	code TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'IDLE',
    error TEXT NULL,
    output TEXT NULL,
    duration INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    
    CONSTRAINT fk_runner_language FOREIGN KEY (programming_language_id) REFERENCES programming_languages(id)
);

INSERT INTO programming_languages(name, file_extension, docker_image, run_command, is_active, timeout, default_code)
VALUES 
('JavaScript', 'js', 'node:20', 'docker run --rm --network none --cpus="0.5" --memory="128m" -v {folder}:/app -w /app node:20 node {fileName}', TRUE, 3000, 'console.log("Hello, World!");'),
('TypeScript', 'ts', 'typescript-runner', 'docker run --rm --network none --cpus="0.5" --memory="128m" -v {folder}:/app -w /app typescript-runner tsx {fileName}', TRUE, 4000, 'const name: string = "Minh";\nconsole.log("Hello " + name + "!");'),
('Go', 'go', 'golang:1.24-alpine', 'docker run --rm --network none --cpus="1.0" --memory="512m" -v {folder}:/app -w /app golang:1.24-alpine go run {fileName}', TRUE, 16000, 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}'),
('Java', 'java', 'openjdk:26-ea-slim', 'docker run --rm --network none --cpus="1.0" --memory="256m" -v {folder}:/app -w /app openjdk:26-ea-slim bash -c "javac {fileName} && java solution"', TRUE, 8000, 'public class solution {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}'),
('Python', 'py', 'python:3.11-slim', 'docker run --rm --network none --cpus="0.5" --memory="128m" -v {folder}:/app -w /app python:3.11-slim python {fileName}', TRUE, 5000, 'print("Hello, World!")');

SELECT * FROM programming_languages

SELECT * FROM runner
 