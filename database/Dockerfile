# Use the official PostgreSQL image
FROM postgres:latest

# Copy the initialization SQL script to the docker-entrypoint-initdb.d directory
# PostgreSQL will automatically run any .sql files in this directory on first startup
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432

# Add healthcheck to ensure PostgreSQL is ready to accept connections
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=5 \
  CMD pg_isready -h localhost -p 5432 -U ${POSTGRES_USER} || exit 1

# CMD ["sh", "-c", "env && echo 'Environment variables shown - container exiting'"]