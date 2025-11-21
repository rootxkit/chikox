# ---------------------------------------------------
# Production Stage (Powred by Node)
# ---------------------------------------------------
FROM node:18-alpine AS production
WORKDIR /app/apps/client

# Copy necessary files and dependencies
COPY --from=builder /app/apps/client/.next ./.next
COPY --from=builder /app/apps/client/node_modules ./node_modules
COPY --from=builder /app/package.json .
# ... (Copy other required files)

ENV NODE_ENV=production
# Vercel's Next.js standard port is 3000, 
# but we use 3001 in docker-compose.yml
EXPOSE 3001 

# CRITICAL: Run the Next.js server using Node, not Nginx
CMD ["npm", "start"] 