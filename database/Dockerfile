FROM postgres:18-alpine
ENV POSTGRES_DB=warehouse
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD="asdfghjkl;'"
COPY init.sql /docker-entrypoint-initdb.d/init.sql
EXPOSE 5432
