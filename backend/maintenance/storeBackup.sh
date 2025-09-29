#!/bin/bash

mongodump --out=./../db_backups/backup_$(date +%Y-%m-%d_%H-%M-%S)
