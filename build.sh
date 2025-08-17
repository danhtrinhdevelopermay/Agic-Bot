#!/bin/bash
echo "Building client..."
cd client && npm run build && cd ..
echo "Client build complete"