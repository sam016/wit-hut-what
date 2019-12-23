#!/bin/sh

echo "Restoring packages..."
dotnet restore --verbosity normal
echo "Restored"

echo "Starting up the server..."
dotnet watch run
