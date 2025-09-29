#!/bin/bash

backup=$(ls -t ../db_backups/ | head -n 1)

mongorestore --dir="../db_backups/$backup"
