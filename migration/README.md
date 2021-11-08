# DIVA Migration Tool

This tool helps you to make the DIVA migration to a higher version smoother. 
You can check the [release notes](https://github.com/FraunhoferISST/diva/releases) or the [Changelog](https://github.com/FraunhoferISST/diva/blob/main/CHANGELOG.md) to know if the 
migration is necessary.

In most cases you can safely use the newer patch or minor version of DIVA. However, it is possible that we may change the 
internal infrastructure or add new features. Then the existing data should also be brought up to date. This migration 
is **optional** and the update does not break the backwards compatibility.

The update of the major version indicates a breaking change and the migration is necessary to guarantee the operability 
of the system.

## Current migration status

The optional migration is available for DIVA **3.1.0**. You can use the migration service to upgrade from DIVA **>=3.0.0** and **<3.1.0**.

Affected Components:

- **DIVA Lake Adapter (DLA)** - create dedicated MongoDB database, create `id` to uploaded file `hash` mapping. 
Required for new Resources delete functionality

- **DCS Adapter (DA)** - create dedicated MongoDB database, migrate MongoDB old `dsc` collection to new database and
  creat `id` to `offer` mapping for all on DSC offered resources. Required for new Resources delete functionality

## Execute migration
To prepare for the migration, deploy DIVA 3.1.0 and then execute the migration. Make sure your DIVA instance
is not actively used in a production environment until the migration is completed to avoid potential inconsistencies.

### With docker

**Requirements**
- Docker 20.10.x
- Docker Compose 1.28.x

Navigate to `docker/` and run:

```sh
docker-compose -f docker-compose.migration.yml up
```

### Manually

**Requirements**
- Node 14.16

Navigate to `migration/`, install dependencies and run the migration script:

>⚠️ Please note that you have to set the environment variables from your `.env` 
> 

```sh
npm i
npm run migrate
```