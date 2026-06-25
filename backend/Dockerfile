FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY TicketSystem.API/TicketSystem.API.csproj TicketSystem.API/
RUN dotnet restore TicketSystem.API/TicketSystem.API.csproj

COPY . .
RUN dotnet publish TicketSystem.API/TicketSystem.API.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_HTTP_PORTS=8080
ENV TZ=America/Sao_Paulo
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends tzdata \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /out ./

EXPOSE 8080
ENTRYPOINT ["dotnet", "TicketSystem.API.dll"]