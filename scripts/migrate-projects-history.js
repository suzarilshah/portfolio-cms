const pool = require('../lib/db-script');

async function migrate() {
  try {
    console.log('Starting Project History & Seeding Migration...');

    // 1. Create Project History Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS project_history (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        snapshot JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Created project_history table.');

    // 2. Seed Projects from Hardcoded Data
    const projects = [
        {
            title: 'Enterprise Cloud Infrastructure Optimization',
            tagline: 'Swift Banking Operations',
            challenge: 'Managing complex cloud infrastructure for critical banking operations requiring 99.9% uptime while optimizing costs and performance.',
            solution: 'Architected and implemented a comprehensive Azure cloud infrastructure with Kubernetes orchestration, automated CI/CD pipelines, and advanced monitoring systems. Deployed infrastructure as code using Terraform for consistency and scalability.',
            impact: [
                { metric: 'Uptime', value: '99.9%' },
                { metric: 'Incident Response', value: '-40%' },
                { metric: 'Deployment Speed', value: '3x Faster' },
                { metric: 'Infrastructure Cost', value: '-25%' },
            ],
            technologies: ['Azure', 'Kubernetes', 'Terraform', 'Azure DevOps', 'Monitoring'],
            category: 'Cloud Architecture',
            icon_name: 'Cloud',
            year: '2024-2025',
        },
        {
            title: 'Containerization & Deployment Optimization',
            tagline: 'Virtual Spirit Cloud Migration',
            challenge: 'Legacy infrastructure with manual deployment processes causing delays and resource inefficiency. Needed modern containerized architecture for scalability.',
            solution: 'Led comprehensive containerization initiative using Docker and Kubernetes. Implemented GitOps workflows with CI/CD automation, reducing deployment complexity and enabling rapid scaling.',
            impact: [
                { metric: 'Resource Utilization', value: '+60%' },
                { metric: 'Deployment Time', value: '85% Reduction' },
                { metric: 'System Reliability', value: '+45%' },
                { metric: 'Developer Productivity', value: '+50%' },
            ],
            technologies: ['Docker', 'Kubernetes', 'GitLab CI/CD', 'Helm', 'Prometheus', 'Grafana'],
            category: 'DevOps Transformation',
            icon_name: 'Container',
            year: '2023-2024',
        },
        {
            title: 'Azure AI-Powered Smart Aquaponics',
            tagline: 'Imagine Cup 2022 - Top 4 Asia',
            challenge: 'Sustainable agriculture requires intelligent automation and real-time monitoring. Traditional farming methods inefficient and resource-intensive.',
            solution: 'Developed IoT-enabled smart aquaponics system powered by Azure IoT Hub, Azure Machine Learning, and computer vision. Implemented automated pH monitoring, nutrient management, and predictive analytics for optimal crop yields.',
            impact: [
                { metric: 'Water Savings', value: '90%' },
                { metric: 'Crop Yield', value: '+40%' },
                { metric: 'Automation', value: '24/7 Monitoring' },
                { metric: 'Recognition', value: 'Top 4 Asia' },
            ],
            technologies: ['Azure IoT Hub', 'Azure ML', 'Python', 'Computer Vision', 'LoRa', 'React'],
            category: 'IoT Cloud Solutions',
            icon_name: 'Cpu',
            year: '2022',
            link: 'https://www.youtube.com/watch?v=example',
        },
        {
            title: 'Azure Cloud Migration & Governance',
            tagline: 'Celcom Axiata Telecommunications',
            challenge: 'Large-scale telecommunications infrastructure needed modernization and cloud migration while maintaining service continuity and regulatory compliance.',
            solution: 'Designed and executed comprehensive Azure cloud migration strategy with emphasis on governance, security, and compliance. Implemented landing zones, hub-spoke architecture, and automated compliance monitoring.',
            impact: [
                { metric: 'Migration Success', value: '100%' },
                { metric: 'Service Continuity', value: 'Zero Downtime' },
                { metric: 'Compliance Score', value: '98%' },
                { metric: 'Operational Cost', value: '-30%' },
            ],
            technologies: ['Azure', 'Azure Policy', 'Landing Zones', 'Azure Security Center', 'Terraform'],
            category: 'Cloud Migration',
            icon_name: 'Network',
            year: '2022-2023',
        },
        {
            title: 'Platform Engineering & Developer Experience',
            tagline: 'Internal Developer Platform (IDP)',
            challenge: 'Development teams struggling with inconsistent environments, complex deployments, and lack of self-service infrastructure provisioning.',
            solution: 'Built comprehensive Internal Developer Platform providing self-service infrastructure, standardized deployment workflows, and golden path templates. Integrated with existing CI/CD systems and monitoring tools.',
            impact: [
                { metric: 'Onboarding Time', value: '-70%' },
                { metric: 'Deployment Frequency', value: '5x Increase' },
                { metric: 'Developer Satisfaction', value: '+80%' },
                { metric: 'Infrastructure Consistency', value: '100%' },
            ],
            technologies: ['Kubernetes', 'ArgoCD', 'Backstage', 'Terraform', 'GitHub Actions'],
            category: 'Platform Engineering',
            icon_name: 'Zap',
            year: '2024',
        },
        {
            title: 'LoRa Network Wearable Tracker',
            tagline: 'IEEE Published Research',
            challenge: 'Creating energy-efficient long-range tracking solution for agricultural and industrial applications with limited infrastructure.',
            solution: 'Designed and developed LoRa-based wearable tracking device with cloud backend for real-time monitoring. Published research in IEEE Xplore on network optimization and power efficiency.',
            impact: [
                { metric: 'Range', value: '15km+' },
                { metric: 'Battery Life', value: '30 Days' },
                { metric: 'Accuracy', value: '95%' },
                { metric: 'Publication', value: 'IEEE Xplore' },
            ],
            technologies: ['LoRa', 'IoT', 'Azure IoT', 'Python', 'C++', 'Node.js'],
            category: 'IoT Research',
            icon_name: 'Code',
            year: '2021',
            link: 'https://ieeexplore.ieee.org',
        }
    ];

    for (let i = 0; i < projects.length; i++) {
        const p = projects[i];
        // Upsert logic
        const res = await pool.query(`
            SELECT id FROM projects WHERE title = $1
        `, [p.title]);

        if (res.rows.length === 0) {
            await pool.query(`
                INSERT INTO projects (
                    title, tagline, challenge, solution, impact, 
                    technologies, category, icon_name, year, link, sort_order
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `, [
                p.title, p.tagline, p.challenge, p.solution, 
                JSON.stringify(p.impact), JSON.stringify(p.technologies),
                p.category, p.icon_name, p.year, p.link || null, i * 10
            ]);
            console.log(`Inserted project: ${p.title}`);
        } else {
             console.log(`Project already exists: ${p.title}`);
        }
    }
    console.log('✅ Seeded initial projects.');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
