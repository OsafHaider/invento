FROM ollama/ollama:latest

RUN ollama serve & \
    sleep 5 && \
    ollama pull phi3

EXPOSE 11434

CMD ["serve"]
