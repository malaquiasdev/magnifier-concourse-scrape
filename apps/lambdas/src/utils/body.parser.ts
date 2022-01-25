import { EntryPointInput } from '@qconcursos/types/entrypoint.input';

export class BodyParser {
  public getEntryPoint(event: any): EntryPointInput {
    const body: EntryPointInput = JSON.parse(event.body ?? '{}');
    if (body.url && body.mails) {
      return body;
    }
    const attributes = event.Records[0].messageAttributes;
    return {
      url: attributes.url.stringValue,
      mails: JSON.parse(attributes.mails.stringValue),
    };
  }
}
