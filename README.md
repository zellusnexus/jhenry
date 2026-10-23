# J. Henry Plumbing – Website

Static recreation of jhenryplumbing.com (HTML/CSS/JS, no build step).
Open `index.html` in a browser.

## Pages

| File | Page |
|------|------|
| index.html | Homepage |
| about.html | About / Meet Our Team |
| memberships.html | Membership plan |
| see-our-work.html | Recent work galleries |
| join-our-team.html | Careers + application form |
| privacy-policy.html | Privacy Policy / messaging terms |
| athens-al-plumber.html | Service area: Athens, AL |
| decatur-al-plumber.html | Service area: Decatur, AL |
| harvest-al-plumber.html | Service area: Harvest, AL |
| huntsville-al-plumber.html | Service area: Huntsville, AL |
| madison-al-plumber.html | Service area: Madison, AL |
| new-market-al-plumber.html | Service area: New Market, AL |
| owens-cross-roads-al-plumber.html | Service area: Owens Cross Roads, AL |
| toney-al-plumber.html | Service area: Toney, AL |
| plumbing-services.html | Service: Plumbing |
| sewer-drain-cleaning.html | Service: Sewer Drain Cleaning |
| septic-systems.html | Service: Septic Systems |
| pump-installation-services.html | Service: Pump Installation & Service |
| backhoe-services.html | Service: Backhoe Services |
| water-heater-repair-installation.html | Service: Water Heater Repair & Installation |
| backflow-testing.html | Service: Backflow Testing |
| contact-us.html | Contact Us (schedule form + contact info) |
| plumbing-news.html | Plumbing News (blog index) |

All pages share `css/styles.css` and `js/main.js`. The header and footer are repeated in each file, so a nav or footer change needs to be made in every page.

## Images

Photos are referenced from `images/` and show a grey placeholder until added:

| File | Used for |
|------|----------|
| hero-huntsville.jpg | Hero background (Huntsville skyline) |
| van.png | Service van below the hero (transparent PNG) |
| work-1.jpg, work-2.jpg, work-3.jpg | Intro gallery |
| promise-bg.jpg | "Our Promise" background |
| service-plumbing.jpg, service-sewer.jpg, service-septic.jpg, service-pump.jpg, service-backhoe.jpg | Service tiles |
| backed-up.jpg | "Call us when you're backed up" photo |
| reviews-bg.jpg | Reviews background |
| news-sewer-line.jpg, news-backflow.jpg, news-septic.jpg, news-warning-signs.jpg, news-drains.jpg, news-water-heater.jpg, news-tankless.jpg | News cards |
| page-hero-van.jpg | Page hero on About and Memberships |
| page-hero-van-side.jpg | Page hero on Privacy Policy |
| page-hero-tools.jpg | Page hero on See Our Work |
| page-hero-team.jpg | Page hero on Join Our Team |
| page-hero-backhoe.jpg, backhoe-excavator.jpg | Backhoe Services hero + photo |
| page-hero-water-heater.jpg, water-heaters-tankless.jpg | Water Heaters hero + photo |
| page-hero-drain.jpg, backflow-device.jpg | Backflow Testing hero + photo |
| about-before.jpg, about-after.jpg | About before/after slider (sewer line trench) |
| van-parked.jpg | About "Environmental Sustainability" photo |
| team-josh-henry.jpg, team-matt-denton.jpg, team-tanner-rozell.jpg, team-jonathan-haas.jpg, team-nate-unsell.jpg, team-dustin-howard.jpg, team-glen-helms.jpg, team-josh-hudson.jpg, team-vicki-self.jpg, team-shane-whitt.jpg, team-jeff-cole.jpg, team-ashley-schreij.jpg | Team headshots (square crops) |
| work-plumbing.jpg, work-tankless.jpg, work-water-heater.jpg | See Our Work section photos |
| gallery-plumbing-1…8.jpg, gallery-tankless-1…4.jpg, gallery-water-heater-1…4.jpg | See Our Work galleries (portrait) |
| van-side.jpg | Join Our Team van photo |
| values-bg.jpg | Join Our Team "Core Values" background |
| page-hero-pipes.jpg | Page hero on the service area and service pages |
| plumbing-tech.jpg | Plumbing Services photo (technician under a sink) |
| sewer-van.jpg | Sewer Drain Cleaning photo (van parked at a home) |
| septic-install.jpg | Septic Systems photo (tank in an excavated yard) |
| pump-install.jpg | Pump Installation photo (sump discharge piping) |
| area-van-sprinter.jpg | Sprinter van photo (Athens, Decatur, Huntsville, Madison) |
| area-van-transit.jpg | Transit van photo (Harvest, New Market, Owens Cross Roads, Toney) |
| different-banner.jpg | "What makes us different" banner (houses + van, ~1000x230) |

Each See Our Work gallery shows the number of photos set in its `data-gallery` attribute (8 for Plumbing, 4 for the others). Add more `<img>` tags beyond that and a "View more" link appears to reveal them.
