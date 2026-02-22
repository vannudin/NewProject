import {
  Server,
  Database,
  HardDrive,
  Network,
  Globe,
  Cpu,
  Shield,
  Layers,
  Box,
  Key,
  MessageSquare,
  Activity,
  Terminal,
  Lock,
  BarChart
} from 'lucide-react';

export const GCP_SERVICES = [
  {
    category: 'Compute',
    items: [
      { id: 'compute-engine', name: 'Compute Engine', icon: Server, color: 'bg-blue-500' },
      { id: 'cloud-run', name: 'Cloud Run', icon: Box, color: 'bg-blue-500' },
      { id: 'gke', name: 'Kubernetes Engine', icon: Layers, color: 'bg-blue-500' },
      { id: 'cloud-functions', name: 'Cloud Functions', icon: Activity, color: 'bg-blue-500' },
    ]
  },
  {
    category: 'Storage',
    items: [
      { id: 'cloud-storage', name: 'Cloud Storage', icon: HardDrive, color: 'bg-green-500' },
      { id: 'persistent-disk', name: 'Persistent Disk', icon: Database, color: 'bg-green-500' },
      { id: 'filestore', name: 'Filestore', icon: HardDrive, color: 'bg-green-500' },
    ]
  },
  {
    category: 'Databases',
    items: [
      { id: 'cloud-sql', name: 'Cloud SQL', icon: Database, color: 'bg-indigo-500' },
      { id: 'cloud-spanner', name: 'Cloud Spanner', icon: Database, color: 'bg-indigo-500' },
      { id: 'firestore', name: 'Firestore', icon: Database, color: 'bg-indigo-500' },
      { id: 'bigtable', name: 'Bigtable', icon: Database, color: 'bg-indigo-500' },
    ]
  },
  {
    category: 'Networking',
    items: [
      { id: 'vpc', name: 'VPC Network', icon: Network, color: 'bg-purple-500' },
      { id: 'cloud-firewall', name: 'Cloud Firewall', icon: Shield, color: 'bg-purple-500' },
      { id: 'cloud-load-balancing', name: 'Load Balancing', icon: Globe, color: 'bg-purple-500' },
      { id: 'cloud-cdn', name: 'Cloud CDN', icon: Globe, color: 'bg-purple-500' },
      { id: 'cloud-dns', name: 'Cloud DNS', icon: Globe, color: 'bg-purple-500' },
      { id: 'cloud-armor', name: 'Cloud Armor', icon: Shield, color: 'bg-purple-500' },
    ]
  },
  {
    category: 'Data & Analytics',
    items: [
      { id: 'bigquery', name: 'BigQuery', icon: BarChart, color: 'bg-yellow-500' },
      { id: 'pubsub', name: 'Pub/Sub', icon: MessageSquare, color: 'bg-yellow-500' },
      { id: 'dataflow', name: 'Dataflow', icon: Activity, color: 'bg-yellow-500' },
      { id: 'dataproc', name: 'Dataproc', icon: Cpu, color: 'bg-yellow-500' },
    ]
  },
  {
    category: 'AI & Machine Learning',
    items: [
      { id: 'vertex-ai', name: 'Vertex AI', icon: Cpu, color: 'bg-orange-500' },
      { id: 'gemini', name: 'Gemini API', icon: MessageSquare, color: 'bg-orange-500' },
    ]
  },
  {
    category: 'Security & Management',
    items: [
      { id: 'cloud-iam', name: 'Cloud IAM', icon: Key, color: 'bg-red-500' },
      { id: 'cloud-kms', name: 'Cloud KMS', icon: Lock, color: 'bg-red-500' },
      { id: 'cloud-monitoring', name: 'Monitoring', icon: BarChart, color: 'bg-red-500' },
      { id: 'cloud-logging', name: 'Logging', icon: Terminal, color: 'bg-red-500' },
    ]
  }
];
