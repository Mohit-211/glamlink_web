/**
 * AI Configuration for TreatmentDetails Content Block
 * Based on the component definition in content-discovery/top-treatment.ts
 */

export interface TreatmentDetailsConfig {
  type: 'TreatmentDetails';
  displayName: 'Treatment Details';
  description: 'Treatment information and benefits';
  category: 'top-treatment';
  complexity: 'high';
  fields: {
    treatmentName: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Treatment Name';
      description: 'Name of the beauty treatment';
    };
    treatmentStats: {
      aiEnabled: boolean;
      type: 'array';
      displayName: 'Treatment Statistics';
      description: 'Key stats and information about the treatment';
      itemFields: {
        icon: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Stat Icon';
          description: 'Emoji or icon representing the statistic';
        };
        label: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Stat Label';
          description: 'Label describing what the statistic represents';
        };
        value: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Stat Value';
          description: 'The actual statistic or measurement';
        };
        backgroundColor: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Background Color';
          description: 'Background color for the stat card';
        };
      };
    };
    description: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Treatment Description';
      description: 'Detailed description of the treatment';
    };
    benefitsTitle: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Benefits Title';
      description: 'Title for the benefits section';
    };
    benefits: {
      aiEnabled: boolean;
      type: 'array';
      displayName: 'Treatment Benefits';
      description: 'List of benefits from the treatment';
      itemFields: {
        benefit: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Benefit';
          description: 'Individual benefit of the treatment';
        };
      };
    };
    treatmentBackground: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Section Background';
      description: 'Background color for the entire section';
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const treatmentDetailsConfig: TreatmentDetailsConfig = {
  type: 'TreatmentDetails',
  displayName: 'Treatment Details',
  description: 'Treatment information and benefits',
  category: 'top-treatment',
  complexity: 'high',
  fields: {
    treatmentName: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Treatment Name',
      description: 'Name of the beauty treatment'
    },
    treatmentStats: {
      aiEnabled: true,
      type: 'array',
      displayName: 'Treatment Statistics',
      description: 'Key stats and information about the treatment',
      itemFields: {
        icon: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Stat Icon',
          description: 'Emoji or icon representing the statistic'
        },
        label: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Stat Label',
          description: 'Label describing what the statistic represents'
        },
        value: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Stat Value',
          description: 'The actual statistic or measurement'
        },
        backgroundColor: {
          aiEnabled: false, // Background colors not typically AI-generated
          type: 'text',
          displayName: 'Background Color',
          description: 'Background color for the stat card'
        }
      }
    },
    description: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Treatment Description',
      description: 'Detailed description of the treatment'
    },
    benefitsTitle: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Benefits Title',
      description: 'Title for the benefits section'
    },
    benefits: {
      aiEnabled: true,
      type: 'array',
      displayName: 'Treatment Benefits',
      description: 'List of benefits from the treatment',
      itemFields: {
        benefit: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Benefit',
          description: 'Individual benefit of the treatment'
        }
      }
    },
    treatmentBackground: {
      aiEnabled: false, // Background styling not typically AI-generated
      type: 'text',
      displayName: 'Section Background',
      description: 'Background color for the entire section'
    }
  },
  aiPrompts: {
    system: 'You are creating comprehensive treatment information for beauty procedures. Focus on accurate, helpful details about treatment duration, benefits, and what clients can expect. Include realistic statistics and compelling benefit descriptions.',
    examples: [
      'Generate details for a facial treatment with stats and benefits',
      'Create information about laser hair removal treatment',
      'Add details for microneedling treatment with expected results',
      'Generate treatment information for chemical peel procedure'
    ]
  }
};