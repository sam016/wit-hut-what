FROM mcr.microsoft.com/dotnet/core/sdk:3.1
WORKDIR /app
RUN apt update
RUN apt install unzip
RUN curl -sSL https://aka.ms/getvsdbgsh | /bin/sh /dev/stdin -v latest -l /vsdbg
RUN dotnet tool install --global dotnet-ef

ENV PATH="${PATH}:/root/.dotnet/tools"

COPY ./entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
